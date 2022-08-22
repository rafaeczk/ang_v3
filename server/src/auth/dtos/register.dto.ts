import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString, Length, NotContains } from "class-validator"

export class RegisterDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @Length(1, 200)
  @ApiProperty()
  email: string
  
  @IsString()
  @IsNotEmpty()
  @Length(5, 50)
  @ApiProperty()
  password: string

  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  @ApiProperty()
  @NotContains('$')
  name: string
}
