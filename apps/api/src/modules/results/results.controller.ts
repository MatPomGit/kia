import { Controller, Get, Headers } from "@nestjs/common";
import { ResultsService } from "./results.service";

@Controller("results")
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Get()
  findAll(@Headers("authorization") authorization?: string) {
    return this.resultsService.findAll(authorization);
  }
}
