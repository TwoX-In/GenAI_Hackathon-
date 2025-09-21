import React, { useEffect, useRef, useState } from "react";
import {
  Upload,
  Palette,
  User,
  FileText,
  Sparkles,
  ChevronRight,
  Star,
  Globe,
  BlocksIcon,
  Box,
  Diamond,
  Mic,
} from "lucide-react";
import "../styles/form.css";
import { ImageUpload } from "./image_upload.jsx/image_upload.jsx";
import { Card } from "../retroui/Card";
import StarFigure from "../figures/star_figure";
import { Text } from "../retroui/Text";
import { Input } from "../retroui/Input";
import { Label } from "../retroui/Label";
import { Button } from "../retroui/Button";
import { Select } from "../retroui/Select";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Request } from "@/request/request";

// Array of Indian states for the dropdown
const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];
const formSchema = z.object({
  name: z.string().min(0, "Name must be at least 2 characters."),
  state: z.string().min(0, "Please select your state."),
  artform: z.string().min(0, "Please enter your art form."),
  market: z.string().min(0, "Please select your target market."),
  story: z.string().min(0, "Story must be at least 10 characters."),
  description: z.string().min(0, "Description must be at least 10 characters."),
});






export function FormPage() {
  //For images
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);
  const [currentField, setCurrentField] = useState(null);
  const lastTranscriptRef = useRef("");
  const baseValueRef = useRef("");
  const actualForm = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      state: "",
      artform: "",
      market: "",
      story: "",
      description: "",
    },
  });
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Handle voice recording button clicks
  const handleVoiceRecord = (field) => {
    if (listening && currentField === field) {
      SpeechRecognition.stopListening();
      setCurrentField(null);
      lastTranscriptRef.current = "";
      baseValueRef.current = "";
    } else {
      resetTranscript();
      lastTranscriptRef.current = "";
      baseValueRef.current = actualForm.getValues(field) || "";
      setCurrentField(field);
      SpeechRecognition.startListening({ continuous: true, interimResults: false });
    }


  };
  useEffect(() => {
    if (!currentField) return;

    const base = baseValueRef.current || "";
    const spoken = transcript || "";
    const updatedValue = (base + (base && spoken ? " " : "") + spoken).trim();
    actualForm.setValue(currentField, updatedValue);
    lastTranscriptRef.current = transcript || "";
  }, [transcript, currentField, actualForm]);

  // Handle form submission
  const huSubmit = async (values) => {
    console.log("Form Values:", values);

    // Map React Hook Form fields to backend expectations
    const formData = new FormData();
    formData.append("artistName", values.name || "");
    formData.append("state", values.state || "");
    formData.append("artForm", values.artform || "");
    formData.append("targetRegion", values.market || "");
    formData.append("artistDescription", values.story || "");
    formData.append("productDescription", values.description || "");
    formData.append("language", "en");

    // Attach the first image if available (API expects a single file under key 'image')
    if (images && images.length > 0) {
      formData.append("image", images[0]);
    }

    try {
      const data = await Request.post("/generateContent", formData)
      console.log(data);




    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser does not support speech recognition.</span>;
  }

  return (
    <Card className="w-full bg-[#F5F5F5] mx-auto group relative m-7">
      <Card.Header className="text-center bg-[#FFF44F]">
        <Card.Title className="">
          Help us know your
          <span className="bg-[#FF003C] font-bold mx-2 italic inline-block group px-2">
            product
          </span>
        </Card.Title>
      </Card.Header>
      <Card.Content className="space-y-8">
        <Form {...actualForm}>
          <form onSubmit={async (e) => {
            e.preventDefault();
            console.log("🚀 raw submit triggered");
            console.log("form state:", actualForm);
            console.log("form values:", actualForm.getValues());
            console.log("form errors:", actualForm.formState.errors);
            await actualForm.handleSubmit(huSubmit)(e);
          }} className="space-y-8">
            {/* SECTION 1: PERSONAL INFO */}
            <section className="border-b border-gray-300 max-w-4xl mx-auto p-6">
              <h6 className=" mb-4 text-lg font-extrabold">
                <span className="bg-[#FF6600] p-2 italic inline-block -skew-x-12">
                  Personal Information
                </span>
              </h6>
              <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(250px,1fr))] ">
                {/* Name */}
                <FormField
                  control={actualForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="grid w-full max-w-sm gap-1.5">
                      <FormLabel><span className="bg-[#88D8FF] p-2 italic inline-block -skew-x-12">
                        Name
                      </span></FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* State */}
                <FormField
                  control={actualForm.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem className="grid w-full max-w-sm gap-1.5">
                      <FormLabel><span className="bg-[#88D8FF] p-2 italic inline-block -skew-x-12">
                        Your State
                      </span></FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}                // ✅ RHF stays in sync
                          onValueChange={field.onChange}     // ✅ Directly updates RHF
                        >
                          <Select.Trigger className="w-full" {...field}>
                            <Select.Value placeholder="Pick your State" />
                          </Select.Trigger>
                          <Select.Content>
                            <Select.Group>
                              {indianStates.map((state) => (
                                <Select.Item key={state} value={state}>
                                  {state}
                                </Select.Item>
                              ))}
                            </Select.Group>
                          </Select.Content>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>
            {/* SECTION 2: PRODUCT INFO */}
            <section className="border-b border-gray-300 max-w-4xl mx-auto p-6 ">
              <h6 className=" mb-4 text-lg font-extrabold">
                <span className="bg-[#FF6600] p-2 italic inline-block -skew-x-12">
                  Some More Details
                </span>
              </h6>
              <div className="cols-2 md:grid md:grid-cols-2 md:gap-4">
                {/* SECTION 2: PRODUCT DETAILS */}
                <FormField control={actualForm.control}
                  name="artform"
                  render={({ field }) => (
                    <FormItem className="grid w-full max-w-sm gap-1.5">
                      <FormLabel><span className="bg-[#88D8FF] p-2 italic inline-block -skew-x-12">
                        Artform
                      </span></FormLabel>
                      <FormControl>
                        <Input placeholder="What is your art form" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                <FormField control={actualForm.control}
                  name="market"
                  render={({ field }) => (
                    <FormItem className="grid w-full max-w-sm gap-1.5">
                      <FormLabel><span className="bg-[#88D8FF] p-2 italic inline-block -skew-x-12">
                        Market Description
                      </span></FormLabel>
                      <FormControl>
                        <Input placeholder="What is your market" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
              </div>
            </section>

            {/* SECTION 3: STORY */}
            <section className="border-b border-gray-300 pb-4 max-w-4xl mx-auto p-6">
              <h6 className=" mb-4 text-lg font-extrabold">
                <span className="bg-[#FF6600] p-2 italic inline-block -skew-x-12">
                  Your Story
                </span>
              </h6>
              <div className="grid gap-4">
                {/* Story */}
                <FormField
                  control={actualForm.control}
                  name="story"
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-1.5">
                      <FormLabel><span className="bg-[#88D8FF] p-2 italic inline-block -skew-x-12">
                        Tell your story
                      </span></FormLabel>
                      <div className="flex items-center">
                        <FormControl>
                          <Textarea
                            placeholder="Share the inspiration, materials used, or any special techniques involved."
                            className="w-full  border border-black p-2 shadow-md focus:outline-none "
                            {...field}
                            disabled={listening && currentField !== "story"}
                          />
                        </FormControl>
                        <FormControl>

                          <button
                            type="button"
                            onClick={() => handleVoiceRecord("story")}
                            className={`ml-2 p-2 rounded-full ${listening && currentField === "story"
                              ? "bg-red-500 text-white"
                              : "bg-gray-200 text-gray-700"
                              }`} {...field}
                          >
                            <Mic size={20} />

                          </button>
                        </FormControl>



                      </div>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={actualForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-1.5">
                      <FormLabel><span className="bg-[#88D8FF] p-2 italic inline-block -skew-x-12">
                        Product Description
                      </span></FormLabel>
                      <div className="flex items-center">
                        <FormControl>
                          <Textarea
                            placeholder="Provide a detailed description of your product"
                            className="w-full  border border-black p-2 shadow-md focus:outline-none "
                            rows={4}
                            {...field}
                            disabled={listening && currentField !== "description"}
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => handleVoiceRecord("description")}
                          className={`ml-2 p-2 rounded-full ${listening && currentField === "description"
                            ? "bg-red-500 text-white"
                            : "bg-gray-200 text-gray-700"
                            }`}
                        >
                          <Mic size={20} />
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            {/* SECTION 4: IMAGE UPLOAD */}
            <section>
              <h6 className="mb-4 text-lg font-semibold"><span className="bg-[#FF6600] p-2 italic inline-block -skew-x-12">
                Product Images
              </span>  </h6>
              <ImageUpload
                images={images}
                setImages={setImages}
                isDragging={isDragging}
                setIsDragging={setIsDragging}
                inputRef={inputRef}
              />
            </section>

            {/* SUBMIT BUTTON */}
            <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
              Submit
            </button>
          </form>
        </Form>
      </Card.Content>
      <Diamond
        fill="#FF5E00"
        stroke="black"
        strokeWidth={1}
        className="absolute -top-2 -right-2 text-black group-hover:animate-bounce"
        size={16}
      />
      <StarFigure
        size={24}
        color="#00AEEF"
        stroke="black"
        className="absolute -bottom-4 -left-4 group-hover:animate-spin"
      />
    </Card>
  );
}