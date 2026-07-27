import { Footer, Header, Kicker } from "../site-components";
import { TimelineExplorer } from "./TimelineExplorer";

export const metadata = {
  title: "Consolidated family timeline",
  description: "A clickable chronology spanning all grandparent surname lines, with every event connected to its research record.",
};

export default function TimelinePage() {
  return <main>
    <Header />
    <section className="page-intro shell timeline-intro">
      <Kicker>Eight lines · one chronology</Kicker>
      <h1>The family timeline</h1>
      <p>Follow documented lives across Stonebridge, Dunmore Cross, Kilnaray, and Larkfield. Choose a family line to see its chronology by itself, or select All lines to restore the complete family view.</p>
      <p className="timeline-instruction">Every event is clickable. It opens the full research note for that event — and every event keeps its evidence label, including the conflicts and the disproofs.</p>
    </section>
    <section className="timeline-page shell"><TimelineExplorer /></section>
    <Footer />
  </main>;
}
