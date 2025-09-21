import { Accordion } from "@/components/retroui/Accordion";
import TranslationBox from "@/components/translation/TranslationBox";

export default function Faqs({ questions }) {
    return (
        <div className="max-w-xl w-xl mx-auto">
            <Accordion type="single" collapsible className="divide-y">
                {questions.map(({ question, answer }, index) => (
                    <Accordion.Item key={index} value={`item-${index}`} className="py-4">
                        <Accordion.Header>
                            {question}
                        </Accordion.Header>
                        <Accordion.Content>
                            {answer}
                            <div className="mt-2">
                                <TranslationBox text={`${question}\n\n${answer}`} label="Translate Q&A" />
                            </div>
                        </Accordion.Content>
                    </Accordion.Item>
                ))}
            </Accordion>
        </div>
    );
}
