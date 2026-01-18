import React from "react";
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
    fontSize: 11,
    fontFamily: "NotoSans",
    color: "#111827",
    lineHeight: 1.35,
  },

  header: {
    marginBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 10,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
  },

  subtitle: {
    marginTop: 10,
    fontSize: 10,
    color: "#6B7280",
  },

  chip: {
    marginTop: 12,
    padding: 10,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
  },

  sectionTitle: {
    marginTop: 18,
    fontSize: 12,
    fontWeight: 700,
    color: "#111827",
  },

  stage: {
    marginTop: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
  },

  stagePeriod: {
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 6,
  },

  stageDesc: {
    fontSize: 10,
    color: "#374151",
  },

  footer: {
    position: "absolute",
    bottom: 24,
    left: 36,
    right: 36,
    fontSize: 9,
    color: "#9CA3AF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 8,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default function RoadmapPdf({ roadmap, chatTitle }) {
  const career = roadmap?.career || "Ścieżka kariery";
  const stages = Array.isArray(roadmap?.stages) ? roadmap.stages : [];

  const generatedAt = new Date().toLocaleString("pl-PL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>AI Career Helper</Text>
          <Text style={styles.subtitle}>Roadmap / Ścieżka kariery</Text>

          <View style={styles.chip}>
            <Text style={{ fontSize: 10, color: "#6B7280" }}>
              Chat: {chatTitle || "Chat"}
            </Text>
            <Text style={{ marginTop: 4, fontSize: 13, fontWeight: 700 }}>
              {career}
            </Text>
          </View>
        </View>

        {/* SECTION */}
        <Text style={styles.sectionTitle}>Plan rozwoju</Text>

        {stages.length === 0 ? (
          <Text style={{ marginTop: 8, color: "#6B7280" }}>
            Brak etapów w roadmapie.
          </Text>
        ) : (
          stages.map((s, i) => (
            <View key={i} style={styles.stage}>
              <Text style={styles.stagePeriod}>
                {s.period || `Etap ${i + 1}`}
              </Text>
              <Text style={styles.stageDesc}>{s.description || "-"}</Text>
            </View>
          ))
        )}

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text>Generated: {generatedAt}</Text>
          <Text>AI Career Helper</Text>
        </View>
      </Page>
    </Document>
  );
}
