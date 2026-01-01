import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { forkliftService } from "../services/forkliftService";

export const useForklifts = () => {
    return useQuery ({
        queryKey: ['forklifts'],
        queryFn: forkliftService.getAllForklifts
    })
};

export const useCreateForklift = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (forkliftData) => forkliftService.createForklift(forkliftData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['forklifts'] });
        }
    });
};

export const useUpdateForklift = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ docId, updates }) => forkliftService.updateForklift({ docId, updates }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['forklifts'] });
        }
    });
};