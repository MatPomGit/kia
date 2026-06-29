import { Injectable } from "@nestjs/common";

@Injectable()
export class CoursesService {
  findAll() {
    return [
      { id: "course-1", code: "AIO", name: "Analiza i obróbka obrazów", term: "2026Z" },
      { id: "course-2", code: "RA", name: "Robotyka afektywna", term: "2026Z" }
    ];
  }
}
