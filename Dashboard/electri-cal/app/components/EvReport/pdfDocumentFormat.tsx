import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { margin: 10, padding: 10 },
  heading: { fontSize: 18, marginBottom: 10, fontWeight: "bold" },
  subheading: { fontSize: 14, marginBottom: 5, fontWeight: "bold" },
  content: { fontSize: 12, marginBottom: 10 },
});

const PDFDocumentFormat = ({ report, formatReport }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.heading}>EV Charging Report </Text>
        {formatReport(report).map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.subheading}>{section.heading}</Text>
            <Text style={styles.content}>{section.content}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default PDFDocumentFormat;
