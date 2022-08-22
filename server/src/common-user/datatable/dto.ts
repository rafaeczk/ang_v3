import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { ArrayMaxSize, ArrayMinSize, ArrayNotEmpty, IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator"

class BodyEl {
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsString({each: true})
  @ApiProperty()
  content: string[]

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  note?: string
}

export class AddDataTableDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string
  
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @ApiProperty()
  header: string[]

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => BodyEl)
  @ApiProperty()
  body: BodyEl[]
}

export class UpdateDataTableDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @ApiProperty()
  header: string[]

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => BodyEl)
  @ApiProperty()
  body: BodyEl[]
}

export class ShareDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  userId: string
  
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  dataTableId: string
}