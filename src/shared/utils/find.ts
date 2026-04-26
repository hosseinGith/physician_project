import { NotFoundException } from '@nestjs/common';
import { ObjectLiteral, Repository } from 'typeorm';

export default async function find<T extends ObjectLiteral>(
 entity: Repository<T>,
 id?: string,
 relations?: string[],
 select?: string[],
) {
 if (!Number.isNaN(Number(id))) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const data = await entity.findOne({
   where: { id },
   relations,
   select,
  } as any);
  if (!data) throw new NotFoundException();
  return data;
 }

 return await entity.find({ relations, select });
}
