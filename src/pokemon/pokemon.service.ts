import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PokemonService {
  
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel:Model<Pokemon>
  ){}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    
    try {
      const pokeon = await this.pokemonModel.create(createPokemonDto);
      return pokeon;
    } catch (error) {
     this.handleExceptions(error);
    }

  }

  findAll({ limit = 10, offset = 0 }: PaginationDto) {
    return this.pokemonModel.find()
    .limit(limit)
    .skip(offset)
    .sort({ no: 1 })
    .select('-__v');
  }

async findOne(term: string) {
  let pokemon: Pokemon | null = null;

  if (!isNaN(+term)) {
    pokemon = await this.pokemonModel.findOne({ no: term });
  }

  // MongoID check
  if(!pokemon && isValidObjectId(term)){
    pokemon = await this.pokemonModel.findById(term);
  }

  // Name check
  if(!pokemon){
    pokemon = await this.pokemonModel.findOne({ name: term.toLocaleLowerCase().trim() });
  }

  if (!pokemon) {
    throw new NotFoundException(`Pokemon with term "${term}" not found`);
  }

  return pokemon;
}

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    
    const pokemon = await this.findOne(term);
    if(updatePokemonDto.name){
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();
    }

    try {
      await pokemon.updateOne(updatePokemonDto, { new: true });
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {   
      this.handleExceptions(error);
    }

  }

    //V1
  // async remove(id: string) {
  //   const pokeon = await this.findOne(id);
  //   await pokeon.deleteOne();
  // }

   async remove(id: string) {
    const result = await this.pokemonModel.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      throw new BadRequestException(`Pokemon with id "${id}" not found`);
    }
    return result;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`Pokemon exist in db ${JSON.stringify(error.keyValue)}`);
    } 
    console.log(error);
    throw new InternalServerErrorException('Failed to create pokemon');
  }
}
