// middleware.ts
import { authMiddleware } from "@clerk/nextjs";
 
export default authMiddleware({
  // Routes publiques
  publicRoutes: ["/"],
  // Routes qui ne nécessitent pas d'authentification mais peuvent accéder aux données utilisateur
  ignoredRoutes: ["/api/public"]
});
 
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};