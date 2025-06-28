import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getTranslations } from "next-intl/server"
import { parseLocaleParams } from "@/lib/i18n/server"

export default async function AuthError({
  params,
  searchParams,
}: {
  params: Promise<{locale: string}>;
  searchParams: Promise<{ error?: string }>
}) {
  const locale = await parseLocaleParams(params);
  const searchParamsObj = await searchParams;
  const error = searchParamsObj.error;
  const t = await getTranslations({locale, namespace: 'Error'});

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold">
            {t('authenticationError')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-sm text-muted-foreground">
            {error === "OAuthAccountNotLinked" && t('oauthAccountNotLinked')}
            {error === "AccessDenied" && t('accessDenied')}
            {!error && t('unexpectedError')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link href="/api/auth/signin">
                {t('tryAgain')}
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">
                {t('goHome')}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}