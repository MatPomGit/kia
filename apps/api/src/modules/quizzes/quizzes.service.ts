import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { AttemptStatus, Prisma } from "@prisma/client";
import { AuthService } from "../auth/auth.service";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class QuizzesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService
  ) {}

  async createAttempt(quizId: string, authorization?: string) {
    this.assertId(quizId, "Identyfikator quizu ma nieprawidłowy format.");
    const session = this.authService.getSessionFromAuthorization(authorization);

    try {
      return await this.prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({
          where: { email: session.sub },
          select: { id: true, email: true }
        });
        if (!user) throw new NotFoundException("Nie znaleziono użytkownika dla podanego tokenu.");

        const quiz = await tx.quiz.findUnique({
          where: { id: quizId },
          select: { id: true, title: true, availableFrom: true, availableTo: true, maxAttempts: true }
        });
        if (!quiz) throw new NotFoundException("Nie znaleziono quizu.");

        const now = new Date();
        if (quiz.availableFrom > now || quiz.availableTo < now) {
          throw new ConflictException("Quiz nie jest aktualnie dostępny.");
        }

        const attemptsCount = await tx.attempt.count({ where: { quizId, studentId: user.id } });
        if (attemptsCount >= quiz.maxAttempts) {
          throw new ConflictException("Wykorzystano maksymalną liczbę podejść do quizu.");
        }

        const attempt = await tx.attempt.create({
          data: {
            quizId,
            studentId: user.id,
            attemptNo: attemptsCount + 1,
            status: AttemptStatus.CREATED
          },
          select: {
            id: true,
            quizId: true,
            studentId: true,
            attemptNo: true,
            status: true,
            startedAt: true,
            finishedAt: true
          }
        });

        return { ...attempt, quizTitle: quiz.title };
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new ConflictException("Nie można utworzyć kolejnej próby dla tego quizu.");
      }
      throw error;
    }
  }

  private assertId(id: string, message: string): void {
    if (typeof id !== "string" || !/^[a-zA-Z0-9_-]{3,80}$/.test(id)) {
      throw new BadRequestException(message);
    }
  }
}
