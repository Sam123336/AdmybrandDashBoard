import { Request, Response } from 'express';
interface AuthRequest extends Request {
    user?: any;
}
export declare const createCampaign: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getMyCampaigns: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getAllCampaigns: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateCampaignStatus: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateCampaignMetrics: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getCampaignById: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteCampaign: (req: AuthRequest, res: Response) => Promise<void>;
export {};
//# sourceMappingURL=campaignController.d.ts.map