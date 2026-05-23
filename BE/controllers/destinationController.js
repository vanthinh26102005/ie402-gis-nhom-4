import { getDestinationResource, listDestinationResources } from "../services/destinationService.js";
import { sendList, sendSuccess } from "../utils/httpResponse.js";

export async function listDestinations(req, res) {
  const result = await listDestinationResources(req.query);
  return sendList(res, result.items, {
    total: result.total,
    limit: result.limit,
    offset: result.offset,
  });
}

export async function getDestination(req, res) {
  const destination = await getDestinationResource(req.params.id);
  return sendSuccess(res, destination);
}
