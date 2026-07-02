import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.course.findMany({
      orderBy: [{ term: "desc" }, { code: "asc" }],
      select: { id: true, code: true, name: true, term: true }
    });
  }

  async findMaterials(courseId: string) {
    this.assertCourseId(courseId);

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        materials: {
          orderBy: [{ publishedAt: "desc" }, { title: "asc" }],
          select: { id: true, title: true, kind: true, objectKey: true, publishedAt: true }
        }
      }
    });

    if (!course) throw new NotFoundException("Nie znaleziono kursu.");
    return course.materials;
  }

  private assertCourseId(courseId: string): void {
    if (typeof courseId !== "string" || !/^[a-zA-Z0-9_-]{3,80}$/.test(courseId)) {
      throw new BadRequestException("Identyfikator kursu ma nieprawidłowy format.");
    }
  }
}
