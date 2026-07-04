import { PrismaClient } from '@prisma/client';
import catalog from './treinos.json';

const prisma = new PrismaClient();

async function main() {
  let created = 0;

  for (const group of catalog.exercicios_catalogo) {
    for (const ex of group.exercicios) {
      await prisma.exercise.upsert({
        where: { id: ex.id },
        update: {},
        create: {
          id: ex.id,
          name: ex.nome,
          muscleGroup: group.categoria,
          equipment: ex.equipamento,
          description: ex.instrucoes.join(' | '),
        },
      });
      created++;
    }
  }

  console.log(`Seed concluído: ${created} exercícios inseridos.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
