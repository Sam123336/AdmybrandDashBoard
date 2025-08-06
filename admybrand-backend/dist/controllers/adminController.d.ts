import { Request, Response } from 'express';
interface AuthRequest extends Request {
    user?: any;
}
export declare const getAllUsers: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getUserById: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateUser: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteUser: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getAdminDashboard: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getCampaignRequests: (req: AuthRequest, res: Response) => Promise<void>;
export {};
//# sourceMappingURL=adminController.d.ts.map