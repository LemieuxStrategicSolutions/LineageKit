import { Footer, Header, Kicker } from "../site-components";
import { ReviewInbox } from "./ReviewInbox";

export const dynamic = "force-dynamic";
export const metadata = { title: "Private contribution review" };

export default function ReviewPage() {
  return <main>
    <Header />
    <section className="review-hero">
      <div className="shell">
        <Kicker>Reviewer-only workspace</Kicker>
        <h1>Contribution inbox</h1>
        <p>Private family submissions remain here until they are screened, researched, and expressly approved for the public archive. Access requires the REVIEWER_TOKEN secret — there is no other sign-in.</p>
      </div>
    </section>
    <ReviewInbox />
    <Footer />
  </main>;
}
