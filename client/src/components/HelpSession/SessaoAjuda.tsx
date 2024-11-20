import React from "react";
import { Container, Typography } from "@mui/material";
import { faqs } from "./faqData";
import FaqItem from "./FaqItem";

const SessaoAjuda: React.FC = () => {
  const renderFaqs = () => {
    return faqs.map((faq, index) => (
      <FaqItem
        key={index}
        question={faq.question}
        answer={faq.answer}
        index={index}
      />
    ));
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: 4, marginBottom: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Perguntas Frequentes (FAQ)
      </Typography>
      {renderFaqs()}
    </Container>
  );
};

export default SessaoAjuda;
