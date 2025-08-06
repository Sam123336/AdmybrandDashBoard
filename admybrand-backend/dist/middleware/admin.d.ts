import { Request, Response, NextFunction } from 'express';
interface AuthRequest extends Request {
    user?: any;
}
export declare const adminOnly: (req: AuthRequest, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=admin.d.ts.map