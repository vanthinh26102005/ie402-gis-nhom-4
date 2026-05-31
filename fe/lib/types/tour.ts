export type CreateTourPayload = {
  name: string;
  description: string;
  destinationIds: string[];
};

export type CreatedTour = CreateTourPayload & {
  id: string;
};
