import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import React from "react";
import { Text, View } from "../../shared/custom-react-native";
import "./css.css";

export function DownloadPDF(id, filename, type) {
  html2canvas(document.getElementById(id)).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "l", // landscape
      unit: "pt", // points, pixels won't work properly
      format: [canvas.width, canvas.height], // set needed dimensions for any element
    });

    pdf.addImage(
      imgData,
      "JPEG",
      0,
      0,
      canvas.width * 0.95,
      canvas.height * 0.95
    );
    // pdf.output('dataurlnewwindow');
    if (type == "download") {
      pdf.save(filename ?? "download.pdf");
    } else if (type == "print") {
      const base64 = pdf.output("datauristring");
      openPdf(
        base64.replace(
          "data:application/pdf;filename=generated.pdf;base64,",
          ""
        )
      );
    }
  });
}

export function openPdf(basePdf) {
  let byteCharacters = atob(basePdf);
  let byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  let byteArray = new Uint8Array(byteNumbers);
  let file = new Blob([byteArray], { type: "application/pdf;base64" });
  let fileURL = URL.createObjectURL(file);
  window.open(fileURL);
}

export default function TransactionReceipt(props) {
  return (
    <View>
      <Text>Hello World</Text>
    </View>
  );
}
