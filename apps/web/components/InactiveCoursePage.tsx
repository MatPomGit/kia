import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

type InactiveCoursePageProps = {
  courseHref: string;
  eyebrow: string;
  title: string;
  description: string;
};

export function InactiveCoursePage({ courseHref, eyebrow, title, description }: InactiveCoursePageProps) {
  return (
    <div className="shell">
      <Header active="dashboard" courseHref={courseHref} title={title} />
      <main id="main" className="container">
        <section className="page-intro">
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </section>

        <section className="tabbed-panel" aria-labelledby="course-status-heading">
          <div className="section-head compact">
            <div>
              <h2 id="course-status-heading">Status przedmiotu</h2>
              <p>Ten przedmiot ma przygotowaną stronę bazową, ale materiały i wejściówki nie są jeszcze aktywne.</p>
            </div>
          </div>
          <article className="card">
            <span className="badge">Wkrótce</span>
            <h2>Moduł w przygotowaniu</h2>
            <p>Po aktywacji przedmiotu pojawią się tutaj informacje organizacyjne, materiały oraz wejściówki.</p>
          </article>
        </section>
      </main>
      <Footer />
    </div>
  );
}
