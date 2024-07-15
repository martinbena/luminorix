import { auth } from "@/auth";
import ProfileFeature from "@/components/user/ProfileFeature";
import ProfileInfo from "@/components/user/ProfileInfo";
import ProfileStats from "@/components/user/ProfileStats";
import RecentOrders from "@/components/user/RecentOrders";
import SpendingsChart from "@/components/user/SpendingsChart";
import { getOrders, getRecentCartItemsByUserId } from "@/db/queries/orders";
import { getUserReviews } from "@/db/queries/user";
import { getAllWishlistedItems } from "@/db/queries/wishlist";
import User from "@/models/User";

export default async function Profile() {
  const session = await auth();
  const user = await User.findById(session?.user._id);

  const { totalOrdersCount, totalSpent, categoryCounts } = await getOrders(
    {},
    user._id
  );
  const { count: wishlistCount } = await getAllWishlistedItems(user._id);
  const { totalReviews } = await getUserReviews(user._id);
  const recentOrderItems = await getRecentCartItemsByUserId(user._id);

  return (
    <>
      <ProfileInfo user={user} />
      <ProfileStats
        orderCount={totalOrdersCount}
        totalSpent={totalSpent}
        wishlistCount={wishlistCount}
        reviewCount={totalReviews}
      />

      <div className="grid grid-cols-2 gap-4 tab-xl:grid-cols-1">
        <ProfileFeature title="Recent orders">
          <RecentOrders recentOrderItems={recentOrderItems} />
        </ProfileFeature>
        <ProfileFeature title="Spending stats">
          <SpendingsChart data={categoryCounts} />
        </ProfileFeature>
      </div>
    </>
  );
}
