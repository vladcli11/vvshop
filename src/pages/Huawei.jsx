import BrandModels from "../components/BrandModels";
import { huaweiModels } from "../data/models";

export default function Huawei() {
  return <BrandModels brandSlug="huawei" models={huaweiModels} />;
}
