import { Injectable, NotFoundException } from "@nestjs/common";
import { AttemptStatus } from "@prisma/client";
import { AuthService } from "../auth/auth.service";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class ResultsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService
  ) {}

  async findAll(authorization?: string) {
    const session = this.authService.getSessionFromAuthorization(authorization);
    const user = await this.prisma.user.findUnique({ where: { email: session.sub }, select: { id: true } });
    if (!user) throw new NotFoundException("Nie znaleziono użytkownika dla podanego tokenu.");

    const attempts = await this.prisma.attempt.findMany({
      where: { studentId: user.id, status: "FINISHED" },
      orderBy: [{ finishedAt: "desc" }, { startedAt: "desc" }],
      select: {
        id: true,
        status: true,
        attemptNo: true,
        startedAt: true,
        finishedAt: true,
        scoreTotal: true,
        resultJson: true,
        quiz: { select: { id: true, title: true, course: { select: { id: true, code: true, name: true, term: true } } } }
      }
    });

    return attempts.map((attempt) => ({
      ...attempt,
      scoreTotal: attempt.scoreTotal?.toString() ?? null
    }));
  }
}
