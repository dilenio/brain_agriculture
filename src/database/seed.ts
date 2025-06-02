import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Producer } from '../modules/farm/entities/producer.entity';
import { Farm } from '../modules/farm/entities/farm.entity';
import { Harvest } from '../modules/farm/entities/harvest.entity';
import { Crop } from '../modules/farm/entities/crop.entity';
import { FarmCropHarvest } from '../modules/farm/entities/farm-crop-harvest.entity';

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'user',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'brain_agriculture',
    entities: [Producer, Farm, Harvest, Crop, FarmCropHarvest],
    synchronize: false, // Evite sincronizacao em producao
  });

  try {
    await dataSource.initialize();
    console.log('Connected to database');

    // Clear existing data (optional, comment out to preserve data)
    // await dataSource.getRepository(FarmCropHarvest).delete({});
    // await dataSource.getRepository(Farm).delete({});
    // await dataSource.getRepository(Producer).delete({});
    // await dataSource.getRepository(Harvest).delete({});
    // await dataSource.getRepository(Crop).delete({});

    // Seed Producers
    const producers = [
      { id: uuidv4(), producer_name: 'Joao Silva', cpf_cnpj: '12345678909' },
      {
        id: uuidv4(),
        producer_name: 'Maria Oliveira',
        cpf_cnpj: '98765432100',
      },
      { id: uuidv4(), producer_name: 'Pedro Santos', cpf_cnpj: '45678912345' },
      {
        id: uuidv4(),
        producer_name: 'Agro ABC Ltda',
        cpf_cnpj: '12345678000195',
      },
      {
        id: uuidv4(),
        producer_name: 'Fazenda Boa Vista S/A',
        cpf_cnpj: '98765432000112',
      },
    ];
    await dataSource.getRepository(Producer).save(producers);
    console.log(`Producers seeded: ${producers.length}`);

    // Seed Harvests
    const harvests = [
      { id: uuidv4(), harvest_name: 'Safra 2023' },
      { id: uuidv4(), harvest_name: 'Safra 2024' },
      { id: uuidv4(), harvest_name: 'Safra 2025' },
    ];
    await dataSource.getRepository(Harvest).save(harvests);
    console.log(`Harvests seeded: ${harvests.length}`);

    // Seed Crops
    const crops = [
      { id: uuidv4(), crop_name: 'Soja' },
      { id: uuidv4(), crop_name: 'Milho' },
      { id: uuidv4(), crop_name: 'Cafe' },
      { id: uuidv4(), crop_name: 'Algodao' },
    ];
    await dataSource.getRepository(Crop).save(crops);
    console.log(`Crops seeded: ${crops.length}`);

    // Seed Farms
    const farms = [
      {
        id: uuidv4(),
        farm_name: 'Fazenda Boa Esperanca',
        city: 'Uberlandia',
        state: 'MG',
        total_farm_area: 100,
        arable_area: 80,
        vegetation_area: 20,
        producer: producers[0],
      },
      {
        id: uuidv4(),
        farm_name: 'Fazenda Santa Clara',
        city: 'Ribeirao Preto',
        state: 'SP',
        total_farm_area: 150,
        arable_area: 120,
        vegetation_area: 30,
        producer: producers[0],
      },
      {
        id: uuidv4(),
        farm_name: 'Fazenda Sao Jose',
        city: 'Londrina',
        state: 'PR',
        total_farm_area: 200,
        arable_area: 160,
        vegetation_area: 40,
        producer: producers[1],
      },
      {
        id: uuidv4(),
        farm_name: 'Fazenda Progresso',
        city: 'Cuiaba',
        state: 'MT',
        total_farm_area: 300,
        arable_area: 250,
        vegetation_area: 50,
        producer: producers[1],
      },
      {
        id: uuidv4(),
        farm_name: 'Fazenda Horizonte',
        city: 'Patos de Minas',
        state: 'MG',
        total_farm_area: 120,
        arable_area: 100,
        vegetation_area: 20,
        producer: producers[2],
      },
      {
        id: uuidv4(),
        farm_name: 'Fazenda Aurora',
        city: 'Campinas',
        state: 'SP',
        total_farm_area: 180,
        arable_area: 140,
        vegetation_area: 40,
        producer: producers[2],
      },
      {
        id: uuidv4(),
        farm_name: 'Fazenda Verde',
        city: 'Maringa',
        state: 'PR',
        total_farm_area: 250,
        arable_area: 200,
        vegetation_area: 50,
        producer: producers[3],
      },
      {
        id: uuidv4(),
        farm_name: 'Fazenda Sol Nascente',
        city: 'Sorriso',
        state: 'MT',
        total_farm_area: 400,
        arable_area: 320,
        vegetation_area: 80,
        producer: producers[3],
      },
      {
        id: uuidv4(),
        farm_name: 'Fazenda Estrela',
        city: 'Araguari',
        state: 'MG',
        total_farm_area: 110,
        arable_area: 90,
        vegetation_area: 20,
        producer: producers[4],
      },
      {
        id: uuidv4(),
        farm_name: 'Fazenda Lua Cheia',
        city: 'Piracicaba',
        state: 'SP',
        total_farm_area: 170,
        arable_area: 130,
        vegetation_area: 40,
        producer: producers[4],
      },
    ];
    await dataSource.getRepository(Farm).save(farms);
    console.log(`Farms seeded: ${farms.length}`);

    // Seed FarmCropHarvest
    const farmCropHarvests = [
      { id: uuidv4(), farm: farms[0], harvest: harvests[0], crop: crops[0] }, // Soja 2023
      { id: uuidv4(), farm: farms[0], harvest: harvests[1], crop: crops[1] }, // Milho 2024
      { id: uuidv4(), farm: farms[1], harvest: harvests[0], crop: crops[2] }, // Cafe 2023
      { id: uuidv4(), farm: farms[1], harvest: harvests[1], crop: crops[0] }, // Soja 2024
      { id: uuidv4(), farm: farms[2], harvest: harvests[0], crop: crops[1] }, // Milho 2023
      { id: uuidv4(), farm: farms[2], harvest: harvests[2], crop: crops[3] }, // Algodao 2025
      { id: uuidv4(), farm: farms[3], harvest: harvests[1], crop: crops[0] }, // Soja 2024
      { id: uuidv4(), farm: farms[3], harvest: harvests[2], crop: crops[1] }, // Milho 2025
      { id: uuidv4(), farm: farms[4], harvest: harvests[0], crop: crops[2] }, // Cafe 2023
      { id: uuidv4(), farm: farms[4], harvest: harvests[1], crop: crops[0] }, // Soja 2024
      { id: uuidv4(), farm: farms[5], harvest: harvests[1], crop: crops[3] }, // Algodao 2024
      { id: uuidv4(), farm: farms[6], harvest: harvests[0], crop: crops[1] }, // Milho 2023
      { id: uuidv4(), farm: farms[7], harvest: harvests[2], crop: crops[0] }, // Soja 2025
      { id: uuidv4(), farm: farms[8], harvest: harvests[0], crop: crops[2] }, // Cafe 2023
      { id: uuidv4(), farm: farms[9], harvest: harvests[1], crop: crops[3] }, // Algodao 2024
    ];
    await dataSource.getRepository(FarmCropHarvest).save(farmCropHarvests);
    console.log(`FarmCropHarvests seeded: ${farmCropHarvests.length}`);

    console.log('Database seeding completed successfully!');
  } catch (error: any) {
    console.error('Error during seeding:', error.message);
  } finally {
    await dataSource.destroy();
  }
}

seed();
