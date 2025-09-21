import React, { useState } from "react";
import { Card } from "@/components/retroui/Card";
import { Button } from "@/components/retroui/Button";
import { Input } from "@/components/retroui/Input";
import { Label } from "@/components/retroui/Label";
import { Text } from "@/components/retroui/Text";
import { Select } from "@/components/retroui/Select";
import { Request } from "@/request/request";
import DesignIdeas from "./DesignIdeas";

const InventoryForm = () => {
  const [formData, setFormData] = useState({
    art_forms: "",
    region: "",
  });
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [error, setError] = useState(null);


  const regionOptions = [
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
    "Delhi",
    "Jammu & Kashmir",
    "Ladakh",
  ];

  const handleArtFormChange = (e) => {
    setFormData(prev => ({
      ...prev,
      art_forms: e.target.value
    }));
  };

  const handleRegionChange = (value) => {
    setFormData(prev => ({
      ...prev,
      region: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRecommendations(null);

    try {
      const requestData = {
        art_forms: [formData.art_forms],
        region: formData.region
      };
      const response = await Request.postByUrl("/inventory/recommendation", requestData);
      
      // Handle both string and object responses
      let recommendationsData;
      
      if (typeof response.recommendations === 'string') {
        try {
          // Try to parse if it's a JSON string
          recommendationsData = JSON.parse(response.recommendations);
        } catch {
          // If parsing fails, set error
          setError("Invalid response format received from server.");
          return;
        }
      } else if (Array.isArray(response.recommendations)) {
        // Backend already parsed it correctly - it's an array
        recommendationsData = response.recommendations;
      } else if (response.recommendations && typeof response.recommendations === 'object') {
        // If it's an object with a recommendations property
        recommendationsData = response.recommendations.recommendations || response.recommendations;
      } else {
        console.log("Unexpected response format:", response.recommendations);
        setError("Unexpected response format received from server.");
        return;
      }
      
      setRecommendations(recommendationsData);
    } catch (err) {
      setError("Failed to get recommendations. Please try again.");
      console.error("Error fetching recommendations:", err);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.art_forms.trim() !== "" && formData.region;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="w-full">
        <Card.Header>
          <Card.Title>🎨 Inventory Recommendations</Card.Title>
          <Card.Description>
            Get personalized inventory recommendations based on your art forms, target region, and upcoming festivals.
          </Card.Description>
        </Card.Header>
        
        <Card.Content>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Art Forms Input */}
            <div className="space-y-2">
              <Label htmlFor="art-forms">Your Art Forms *</Label>
              <Input
                id="art-forms"
                type="text"
                placeholder="e.g., Pottery, Textiles, Wood Carving, Jewelry Making..."
                value={formData.art_forms}
                onChange={handleArtFormChange}
              />
              <Text className="text-sm text-gray-600">
                Describe your primary art forms or crafts (e.g., "Pottery and Ceramics", "Textile Weaving", "Wood Carving")
              </Text>
            </div>

            {/* Target Region Selection */}
            <div className="space-y-2">
              <Label htmlFor="region">Target Region *</Label>
              <Select value={formData.region} onValueChange={handleRegionChange}>
                <Select.Trigger className="w-full">
                  <Select.Value placeholder="Select where you want to sell your products" />
                </Select.Trigger>
                <Select.Content>
                  {regionOptions.map((region) => (
                    <Select.Item key={region} value={region}>
                      {region}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={!isFormValid || loading}
              className="w-full"
              size="lg"
            >
              {loading ? "Getting Recommendations..." : "Get Recommendations"}
            </Button>
          </form>
        </Card.Content>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="w-full border-red-500 bg-red-50">
          <Card.Content>
            <Text className="text-red-700">{error}</Text>
          </Card.Content>
        </Card>
      )}

      {/* Recommendations Display */}
      {recommendations && Array.isArray(recommendations) && (
        <Card className="w-full">
          <Card.Header>
            <Card.Title>🎯 Your Recommendations</Card.Title>
            <Card.Description>
              Personalized inventory suggestions for your target market
            </Card.Description>
          </Card.Header>
          
          <Card.Content>
            <div className="space-y-6">
              {recommendations.map((rec, index) => (
                <div key={index} className="border-2 border-gray-200 p-4 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <Text as="h3" className="text-xl font-semibold text-primary">
                      🎉 {rec.holiday}
                    </Text>
                    <Text className="text-sm text-gray-600 font-mono">
                      {rec.date}
                    </Text>
                  </div>
                  
                  <div>
                    <Text as="h4" className="font-medium mb-2">Recommended Items:</Text>
                    <ul className="list-disc list-inside space-y-1">
                      {rec.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-gray-700">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                    <Text className="text-sm text-blue-800">
                      <strong>Why this works:</strong> {rec.reason}
                    </Text>
                  </div>

                  {/* Design ideas generator */}
                  <DesignIdeas
                    artForms={formData.art_forms}
                    region={formData.region}
                    recommendation={rec}
                  />
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      )}
    </div>
  );
};

export default InventoryForm;
