import React, { useState } from "react";
import { Card } from "@/components/retroui/Card";
import { Button } from "@/components/retroui/Button";
import { Input } from "@/components/retroui/Input";
import { Label } from "@/components/retroui/Label";
import { Text } from "@/components/retroui/Text";
import { Request } from "@/request/request";

const DesignIdeas = ({ artForms, region, recommendation }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [styleHint, setStyleHint] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setImageUrl(null);
    try {
      const payload = {
        art_forms: Array.isArray(artForms) ? artForms : [artForms],
        region,
        holiday: recommendation.holiday,
        items: recommendation.items,
        reason: recommendation.reason,
        style_hint: styleHint || undefined,
      };
      const res = await Request.postByUrl("/inventory/design-ideas", payload);
      if (!res?.image_data_url) {
        throw new Error(res?.error || "No image returned");
      }
      setImageUrl(res.image_data_url);
    } catch (e) {
      console.error(e);
      setError(
        e?.response?.data?.detail?.message ||
          e?.message ||
          "Failed to generate design idea. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full mt-3">
      <Card.Content>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="style-hint">Optional style hint</Label>
              <Input
                id="style-hint"
                placeholder="e.g., earthy palette, minimal patterns, flat lay"
                value={styleHint}
                onChange={(e) => setStyleHint(e.target.value)}
              />
            </div>
            <Button onClick={handleGenerate} disabled={loading} className="w-full md:w-auto">
              {loading ? "Generating..." : "Generate Design Idea"}
            </Button>
          </div>

          {error && (
            <Text className="text-red-700">{error}</Text>
          )}

          {imageUrl && (
            <div className="mt-2">
              <img src={imageUrl} alt="Design concept" className="w-full border-2" />
            </div>
          )}
        </div>
      </Card.Content>
    </Card>
  );
};

export default DesignIdeas;


