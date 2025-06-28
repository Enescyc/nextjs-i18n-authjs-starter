import { signIn } from "@/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getTranslations } from "next-intl/server"
import { parseLocaleParams } from "@/lib/i18n/server"

export default async function SignInPage({
  params,
  searchParams
}: {
  params: Promise<{locale: string}>;
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  const locale = await parseLocaleParams(params);
  const { error, callbackUrl } = await searchParams;
  const t = await getTranslations({locale, namespace: 'Auth'});
  const tError = await getTranslations({locale, namespace: 'Error'});

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold">
            {t('signIn')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">
                {error === "OAuthAccountNotLinked" && tError('oauthAccountNotLinked')}
                {error === "AccessDenied" && tError('accessDenied')}
                {!["OAuthAccountNotLinked", "AccessDenied"].includes(error) && tError('unexpectedError')}
              </p>
            </div>
          )}
          
          <form
            action={async () => {
              "use server"
              await signIn("google", { 
                redirectTo: callbackUrl || `/${locale}/dashboard` 
              })
            }}
          >
            <Button type="submit" className="w-full" size="lg">
              Continue with Google
            </Button>
          </form>
          
          <div className="text-center">
            <Button variant="ghost" asChild>
              <a href={`/${locale}`}>
                {tError('goHome')}
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}