import { useMutation, useQueryClient } from "@tanstack/react-query";
import { forkliftService } from "../services/forkliftService";

export const useCreateForklift = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (forkliftData) => forkliftService.createForklift(forkliftData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['forklifts'] });
        }
    });
};