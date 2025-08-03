import dotenv from 'dotenv';
dotenv.config();
import { Request, Response } from "express";
import {
  Client,
  PlaceAutocompleteRequest,
  PlaceAutocompleteType,
  PlaceDetailsRequest,
  PlaceType2,
} from "@googlemaps/google-maps-services-js";

const client = new Client({});

//Get addresses from search text using google places api
const searchAddress = async (req: Request, res: Response) => {
 
  const addressSearchResult: any = [];
  const searchText = req.query.text as string;

  if (!searchText || searchText === "")
    return res.json({
      success: true,
      message: "Addresses fetched",
      data: addressSearchResult,
    });

  try {
    const params: PlaceAutocompleteRequest = {
      params: {
        input: searchText,
        types: PlaceAutocompleteType.address,
        key: process.env.GOOGLE_PLACES_API_KEY as string,
      },
    };

    const response = await client.placeAutocomplete(params);

    if (!response?.data)
      return res.status(500).json({
        success: false,
        message: "no data in response from google api",
      });

    for (const prediction of response.data.predictions) {
      const params: PlaceDetailsRequest = {
        params: {
          place_id: prediction.place_id,
          key: process.env.GOOGLE_PLACES_API_KEY as string,
        },
      };
      const response = await client.placeDetails(params);

      const addressComponent = (
        addressComponentType: PlaceType2,
        key?: "long_name" | "short_name"
      ) => {
        return response.data.result.address_components?.filter(
          (addressComponent) =>
            addressComponent.types.includes(addressComponentType)
        )?.[0]?.[key ?? "long_name"];
      };

      if (response?.data?.result) {
        const addressComponentFormatted = {
          formattedAddress: response.data.result.formatted_address,
          formattedAddress2: response.data.result.address_components
            ?.map((add) => add.long_name)
            .join(", "),
          streetNumber: addressComponent(PlaceType2.street_number) ?? "",
          addressLine1: addressComponent(PlaceType2.route) ?? "",
          addressLine2: addressComponent(PlaceType2.neighborhood) ?? "",
          city:
            addressComponent(PlaceType2.locality) ??
            addressComponent(PlaceType2.sublocality) ??
            addressComponent(PlaceType2.administrative_area_level_3) ??
            addressComponent(PlaceType2.postal_town) ??
            "",
          state:
            addressComponent(PlaceType2.administrative_area_level_1) ??
            addressComponent(PlaceType2.administrative_area_level_2) ??
            addressComponent(PlaceType2.locality) ??
            addressComponent(PlaceType2.sublocality) ??
            "",
          stateCode:
            addressComponent(
              PlaceType2.administrative_area_level_1,
              "short_name"
            ) ??
            addressComponent(PlaceType2.locality, "short_name") ??
            addressComponent(PlaceType2.administrative_area_level_2) ??
            addressComponent(PlaceType2.sublocality, "short_name") ??
            "",
          postalCode: addressComponent(PlaceType2.postal_code) ?? "",
          country: addressComponent(PlaceType2.country) ?? "",
          countryCode: addressComponent(PlaceType2.country, "short_name") ?? "",
          geometry: response.data.result.geometry,
        };

        addressSearchResult.push(addressComponentFormatted);
      }
    }

    //Return addresses
    return res.json({
      success: true,
      message: "Addresses fetched",
      data: addressSearchResult,
    });
  } catch (error) {
    console.error(`searchAddress: ${error}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

export default searchAddress;
