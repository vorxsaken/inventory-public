import { ReactElement, useEffect } from "react"
import Layout from "@/components/layouts/Layout"
import type { NextPageWithLayout, storeType } from "@/lib/types"
import ChildLayout from "@/components/layouts/ChildLayout"
import AddMenu from "@/components/menu"
import { ReportCards } from "@/components/reports/ReportCards"
import { BiCategory } from 'react-icons/bi'
import { BsBox } from 'react-icons/bs'
import { LuFileInput } from 'react-icons/lu'
import { HiOutlineArchiveBoxArrowDown } from 'react-icons/hi2'
import Revenue from "@/components/reports/Revenue"
import { RecentSales } from "@/components/reports/RecentSales"
import { useSelector } from "react-redux"
import { dispatch } from "@/store"
import { fetchDashboards } from "@/store/reducers/dashboardReducer"

const Dashboard: NextPageWithLayout = () => {
  const { dashboard, loading } = useSelector((state: storeType) => state.dashboard);
  // eslint-disable-next-line react/jsx-key
  const reportCardIcons = [<BsBox />, <BiCategory />, <LuFileInput />, <HiOutlineArchiveBoxArrowDown />];

  useEffect(() => {
    if (!dashboard) dispatch(fetchDashboards())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="w-full flex-start flex-col gap-4">
      <div className="w-full flex-start gap-2 flex-wrap lg:flex-nowrap">
        {
          [...Array(4)].map((i, index) => (
            <ReportCards
              key={index}
              style="dashboard"
              title={dashboard?.countInventory ? dashboard.countInventory[index][2] : '...'}
              value={dashboard?.countInventory ? dashboard.countInventory[index][1] : 0}
              isCurrency={dashboard?.countInventory ? dashboard.countInventory[index][3] : false}
              icon={reportCardIcons[index]}
              subtitle={dashboard?.countInventory ? dashboard.countInventory[index][5] : null}
              loading={loading}
            />
          ))
        }
      </div>
      <div className="w-full flex-start gap-2 flex-wrap lg:flex-nowrap">
        <div className="w-full shrink">
          <Revenue trends={dashboard?.report?.salesTrends as any} loading={loading} />
        </div>
        <div className="w-full lg:w-[30%] shrink-0">
          <RecentSales sales={dashboard?.recentOrder as any || []} loading={loading}/>
        </div>
      </div>
    </div>
  )
}

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title="Dashboard">
      <ChildLayout
        title="Dashboard"
        description="View summary of your various data in one place"
        sideButton={<AddMenu />}
      >
        {page}
      </ChildLayout>
    </Layout>
  )
}

export default Dashboard
