import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

Font.register({
  family: "NotoSans",
  fonts: [
    { src: "../public/font/NotoSans-Regular.ttf", fontWeight: 400 },
    { src: "../public/font/NotoSans-Bold.ttf", fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 10.5,
    fontFamily: "NotoSans",
    color: "#111827",
    lineHeight: 1.35,
  },

  header: {
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 10,
  },

  title: {
    fontSize: 18,
    fontWeight: 700,
  },

  subtitle: {
    marginTop: 6,
    fontSize: 10,
    color: "#6B7280",
  },

  chip: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
  },

  careerTitle: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: 700,
  },

  sectionTitle: {
    marginTop: 14,
    marginBottom: 6,
    fontSize: 12,
    fontWeight: 700,
    color: "#111827",
  },

  block: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    marginBottom: 10,
  },
  block1: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
  },

  muted: {
    color: "#6B7280",
  },

  bullet: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 3,
  },

  bulletDot: {
    width: 10,
    color: "#111827",
    fontWeight: 700,
  },

  bulletText: {
    flex: 1,
    color: "#374151",
  },

  grid2: {
    flexDirection: "row",
    gap: 20,
  },

  col: {
    flex: 1,
  },

  weekCard: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#FAFAFA",
  },

  weekTitle: {
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 6,
  },

  label: {
    fontSize: 10,
    fontWeight: 700,
    marginTop: 6,
    marginBottom: 3,
  },

  done: {
    marginTop: 6,
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },

  footer: {
    position: "absolute",
    bottom: 22,
    left: 36,
    right: 36,
    fontSize: 9,
    color: "#9CA3AF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

function BulletList({ items }) {
  if (!Array.isArray(items) || items.length === 0) {
    return <Text style={styles.muted}>Brak.</Text>;
  }

  return (
    <View>
      {items.map((it, idx) => (
        <View key={idx} style={styles.bullet}>
          <Text style={styles.bulletDot}>•</Text>
          <Text style={styles.bulletText}>{String(it)}</Text>
        </View>
      ))}
    </View>
  );
}

export default function RoadmapPdf({ roadmap, chatTitle }) {
  const generatedAt = new Date().toLocaleString("pl-PL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const career = roadmap?.career || "Ścieżka kariery";
  const fitSummary = roadmap?.fit_summary || "";

  const topStrengths = roadmap?.top_strengths || [];
  const skillGaps = roadmap?.skill_gaps || [];
  const whyNotOther = roadmap?.why_not_other || [];

  const weeks = roadmap?.roadmap_12_weeks || [];
  const projects = roadmap?.projects || [];

  const milestones = roadmap?.milestones || [];
  const risks = roadmap?.risks || [];
  const nextQuestions = roadmap?.next_questions || [];

  const legacyStages = roadmap?.stages || [];

  const hasNew = Array.isArray(weeks) && weeks.length > 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>AI Career Helper</Text>
          <Text style={styles.subtitle}>
            Roadmap / Ścieżka kariery — wersja PDF
          </Text>

          <View style={styles.chip}>
            <Text style={{ fontSize: 10, color: "#6B7280" }}>
              Chat: {chatTitle || "Chat"}
            </Text>
            <Text style={styles.careerTitle}>{career}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          Dlaczego to pasuje (fit summary)
        </Text>

        <View style={styles.block1}>
          <Text style={fitSummary ? styles.bulletText : styles.muted}>
            {fitSummary || "Brak podsumowania dopasowania."}
          </Text>
        </View>

        <View style={styles.grid2}>
          <View style={styles.col}>
            <Text style={styles.sectionTitle}>Top strengths</Text>
            <View style={styles.block}>
              <BulletList items={topStrengths} />
            </View>
          </View>

          <View style={styles.col}>
            <Text style={styles.sectionTitle}>Skill gaps</Text>
            <View style={styles.block}>
              <BulletList items={skillGaps} />
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Dlaczego nie inne ścieżki</Text>
        <View style={styles.block}>
          <BulletList items={whyNotOther} />
        </View>

        <Text style={styles.sectionTitle}>Projekty (minimum 3)</Text>
        {Array.isArray(projects) && projects.length > 0 ? (
          projects.slice(0, 4).map((p, idx) => (
            <View key={idx} style={styles.block} wrap={false}>
              <Text style={{ fontWeight: 700, fontSize: 11 }}>{p.name}</Text>
              <Text style={[styles.muted, { marginTop: 2 }]}>{p.goal}</Text>

              <Text style={styles.label}>Requirements</Text>
              <BulletList items={p.requirements} />

              <Text style={styles.label}>Stack</Text>
              <BulletList items={p.stack} />

              <Text style={styles.label}>Deliverables</Text>
              <BulletList items={p.deliverables} />
            </View>
          ))
        ) : (
          <View style={styles.block}>
            <Text style={styles.muted}>Brak projektów.</Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text>Generated: {generatedAt}</Text>
          <Text>AI Career Helper</Text>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Plan wykonania</Text>
          <Text style={styles.subtitle}>
            12 tygodni — sprinty tygodniowe + definicja “DONE”
          </Text>
        </View>

        {hasNew ? (
          <View>
            {weeks.map((w) => (
              <View key={w.week} style={styles.weekCard}>
                <Text style={styles.weekTitle}>
                  Week {w.week}: {w.theme}
                </Text>

                <Text style={styles.label}>Goals</Text>
                <BulletList items={w.goals} />

                <Text style={styles.label}>Tasks</Text>
                <BulletList items={w.tasks} />

                <Text style={styles.label}>Deliverables</Text>
                <BulletList items={w.deliverables} />

                <Text style={styles.label}>Checks</Text>
                <BulletList items={w.checks} />

                <View style={styles.done}>
                  <Text style={{ fontWeight: 700 }}>DONE definition</Text>
                  <Text style={styles.bulletText}>
                    {w.done_definition || "-"}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : Array.isArray(legacyStages) && legacyStages.length > 0 ? (
          <View>
            <Text style={styles.muted}>
              (Fallback) Stary format roadmapy (stages):
            </Text>

            {legacyStages.map((s, idx) => (
              <View key={idx} style={styles.block}>
                <Text style={{ fontWeight: 700 }}>{s.period}</Text>
                <Text style={[styles.muted, { marginTop: 3 }]}>
                  {s.description}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.block}>
            <Text style={styles.muted}>Brak planu tygodniowego.</Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text>Generated: {generatedAt}</Text>
          <Text>AI Career Helper</Text>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Milestones / Risks / Next questions</Text>
          <Text style={styles.subtitle}>
            Checkpointy i co robić gdy utkniesz
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Milestones</Text>
        <View style={styles.block}>
          <BulletList items={milestones} />
        </View>

        <Text style={styles.sectionTitle}>Risks</Text>
        <View style={styles.block}>
          <BulletList items={risks} />
        </View>

        <Text style={styles.sectionTitle}>Next questions</Text>
        <View style={styles.block}>
          <BulletList items={nextQuestions} />
        </View>

        <View style={styles.footer}>
          <Text>Generated: {generatedAt}</Text>
          <Text>AI Career Helper</Text>
        </View>
      </Page>
    </Document>
  );
}
