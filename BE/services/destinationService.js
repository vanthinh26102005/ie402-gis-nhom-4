import { notFound } from "../utils/apiError.js";
import {
  getDestinationById,
  getDestinationCoordinates,
  listDestinations,
} from "../repositories/destinationRepository.js";

export async function listDestinationResources(query) {
  return listDestinations(query);
}

export async function getDestinationResource(id) {
  const destination = await getDestinationById(id);
  if (!destination) {
    throw notFound("Destination not found");
  }

  return destination;
}

export async function resolveDestinationCoordinates(id) {
  const coordinates = await getDestinationCoordinates(id);
  if (!coordinates) {
    throw notFound("Destination waypoint not found");
  }

  return coordinates;
}
