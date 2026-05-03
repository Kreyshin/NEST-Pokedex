import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance} from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';

@Injectable()
export class SeedService {

  private readonly apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=151';
  private readonly axios: AxiosInstance = axios;

  constructor(
      @InjectModel(Pokemon.name)
      private readonly pokemonModel:Model<Pokemon>
    ){}

  // async executeSeed() {
  //    await this.pokemonModel.deleteMany({});

  //   const response = await this.axios.get<PokeResponse>(this.apiUrl);
  //   const promInsert: Promise<Pokemon>[] = [];

  //   response.data.results.forEach( async ({name, url}) => {
  //     const segments = url.split('/').filter(segment => segment);
  //     const no = +segments[segments.length - 1];

  //     // const pokemon = await this.pokemonModel.create({name, no});

  //     promInsert.push(this.pokemonModel.create({no,name}));
  //   });

  //   await Promise.all(promInsert);

  //   return "Seed Executed";

  // }

  async executeSeed() {
     await this.pokemonModel.deleteMany({});

    const response = await this.axios.get<PokeResponse>(this.apiUrl);

    const promInsert: {name: string, no: number}[] = [];

    response.data.results.forEach( async ({name, url}) => {
      const segments = url.split('/').filter(segment => segment);
      const no = +segments[segments.length - 1];
      promInsert.push({no,name});
    });

    await this.pokemonModel.insertMany(promInsert);

    return "Seed Executed";

  }
}
