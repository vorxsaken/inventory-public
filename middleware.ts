import { withAuth } from "next-auth/middleware"

export default withAuth(
    {
        callbacks: {
            authorized: ({ token }) => {
                if(token) return true

                return false;
            },
        },
        pages: {
            signIn: '/auth/login'
        }
    }
)

export const config = { matcher: ["/", "/dashboard/:path*", "/data/:path*", "/report/:path*"] }