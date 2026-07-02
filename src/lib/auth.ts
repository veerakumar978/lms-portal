import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        let emailToSearch = credentials.email;
        
        // Handle Student ID / Faculty ID resolve if no domain suffix is present
        if (!credentials.email.includes("@")) {
          const lower = credentials.email.toLowerCase();
          if (lower.includes("student")) {
            emailToSearch = "student@matha.edu";
          } else if (lower.includes("faculty")) {
            emailToSearch = "faculty@matha.edu";
          } else if (lower.includes("admin")) {
            emailToSearch = "admin@matha.edu";
          } else if (lower.includes("placement")) {
            emailToSearch = "placement@matha.edu";
          } else if (lower.includes("agency")) {
            emailToSearch = "agency@matha.edu";
          } else if (lower.includes("recruiter")) {
            emailToSearch = "recruiter@google.com";
          } else if (lower.includes("employer")) {
            emailToSearch = "employer@google.com";
          } else if (lower.includes("college")) {
            emailToSearch = "college@matha.edu";
          }
        }
        
        const user = await prisma.user.findUnique({
          where: { email: emailToSearch }
        });
        
        if (!user) return null;
        
        if (user.password === credentials.password) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          };
        }
        
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/login"
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET
};
