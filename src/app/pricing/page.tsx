import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import { TooltipProvider } from "@/components/ui/tooltip"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { PLANS } from "@/config/stripe"
import { cn } from "@/lib/utils"

const Page = () => {
	const {getUser} = getKindeServerSession()
	const user = getUser()
	
	const pricingItems = [
		{
			plan: 'Free',
			tagline: 'For small side projects.',
			quota: 10,
			features: [
				{
					text: '5 pages per PDF',
					footnote: 'The maximum amount of pages per PDF-file.',
				},
				{
					text: '4MB file size limit',
					footnote: 'The maximum file size of a single PDF file.',
				},
				{
					text: 'Mobile-friendly interface',
				},
				{
					text: 'Higher-quality responses',
					footnote: 'Better algorithmic responses for enhanced content quality',
					negative: true,
				},
				{
					text: 'Priority support',
					negative: true,
				},
			],
		},
		{
			plan: 'Pro',
			tagline: 'For larger projects with higher needs.',
			quota: PLANS.find((p) => p.slug === 'pro')!.quota,
			features: [
				{
					text: '25 pages per PDF',
					footnote: 'The maximum amount of pages per PDF-file.',
				},
				{
					text: '16MB file size limit',
					footnote: 'The maximum file size of a single PDF file.',
				},
				{
					text: 'Mobile-friendly interface',
				},
				{
					text: 'Higher-quality responses',
					footnote: 'Better algorithmic responses for enhanced content quality',
				},
				{
					text: 'Priority support',
				},
			],
		},
	]
	return(
		<>
			<MaxWidthWrapper className="mb-8 mt-24 text-center max-w-5xl">
				<div className="mx-auto mb-10 sm:max-w-lg">
					<h1 className="text-6xl font-bold sm:text-7xl">Pricing</h1>
					<p className="mt-5 text-gray-600 sm:text-lg">
						Wheter you&apos;re just trying out our service or need more, we&apos;ve got you covered.
					</p>
				</div>

				<div className="pt-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
					<TooltipProvider>
						{
							pricingItems.map(({ plan, tagline, quota, features }) => {
								const price = PLANS.find((p) => p.slug === plan.toLowerCase())?.pricing.amount || 0

								return (
									<div key={plan} className={cn(`relative rounded-2xl bg-white shadow-lg`, {
										"border-2 border-blue-600 shadow-blue-200": plan === "Pro",
										"border boder-gray-200": plan !== "Pro"
									})}>
										{plan === "Pro" && (
											<div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-3 py-2 text-sm font-medium text-white">
												Upgrade now
											</div>
										)}

										<div className="p-5">
											<h3 className="my-3 text-center font-display text-3xl font-bold">
												{plan}
											</h3>
											<p className="text-gray-500">{tagline}</p>
											<p className="my-5 font-display text-6xl font-semibold">${price}</p>
											<p className="text-gray-500">per month</p>
										</div>
                    <div className='flex h-20 items-center justify-center border-b border-t border-gray-200 bg-gray-50'></div>
									</div>
								)
							})
						}
					</TooltipProvider>
				</div>
			</MaxWidthWrapper>
		</>
	)
}

export default Page