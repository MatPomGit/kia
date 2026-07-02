import { Controller, Get, Param } from "@nestjs/common";
import { CoursesService } from "./courses.service";

@Controller("courses")
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @Get(":id/materials")
  findMaterials(@Param("id") courseId: string) {
    return this.coursesService.findMaterials(courseId);
  }
}
