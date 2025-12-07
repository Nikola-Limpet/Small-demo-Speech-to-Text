import { Card } from '@/components/ui/card'

import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { DashboardFooter } from '@/components/dashboard/dashboard-footer'
import StatisticsCard from '@/components/dashboard/statistics-card'
import ProductInsightsCard from '@/components/dashboard/widget-product-insights'
import TotalEarningCard from '@/components/dashboard/widget-total-earning'
import SalesMetricsCard from '@/components/dashboard/chart-sales-metrics'
import TransactionDatatable from '@/components/dashboard/datatable-transaction'

import { StatisticsCardData, earningData, transactionData } from '@/components/dashboard/dashboard-data'

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader />
      <main className='mx-auto w-full max-w-7xl flex-1 px-4 py-4 sm:px-6'>
        <div className='grid grid-cols-2 gap-6 lg:grid-cols-3'>
          {/* Statistics Cards */}
          <div className='col-span-full grid gap-6 sm:grid-cols-3 md:max-lg:grid-cols-1'>
            {StatisticsCardData.map((card, index) => (
              <StatisticsCard
                key={index}
                icon={card.icon}
                title={card.title}
                value={card.value}
                changePercentage={card.changePercentage}
              />
            ))}
          </div>

          <div className='grid gap-6 max-xl:col-span-full lg:max-xl:grid-cols-2'>
            {/* Product Insights Card */}
            <ProductInsightsCard className='justify-between gap-3 [&>[data-slot=card-content]]:space-y-5' />

            {/* Total Earning Card */}
            <TotalEarningCard
              title='Total Earning'
              earning={24650}
              trend='up'
              percentage={10}
              comparisonText='Compare to last year ($84,325)'
              earningData={earningData}
              className='justify-between gap-5 sm:min-w-0 [&>[data-slot=card-content]]:space-y-7'
            />
          </div>

          <SalesMetricsCard className='col-span-full xl:col-span-2 [&>[data-slot=card-content]]:space-y-6' />

          <Card className='col-span-full w-full py-0'>
            <TransactionDatatable data={transactionData} />
          </Card>
        </div>
      </main>
      <DashboardFooter />
    </>
  )
}
