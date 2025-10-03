import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import UnitConverterView from '../views/UnitConverterView.vue';
import VolumeWeightCalculatorView from '../views/VolumeWeightCalculatorView.vue';
import SimpleLayoutCalculatorView from '../views/SimpleLayoutCalculatorView.vue';
import ColorModeConverterView from '../views/ColorModeConverterView.vue';
import ColorDifferenceView from '../views/ColorDifferenceView.vue';
import PackagingIconsView from '../views/PackagingIconsView.vue';
import PaperWeightThicknessConverterView from '../views/PaperWeightThicknessConverterView.vue';
import PackagingMaterialDatabaseView from '../views/PackagingMaterialDatabaseView.vue';
import PrepressChecklistView from '../views/PrepressChecklistView.vue';
import ProjectTimelineEstimatorView from '../views/ProjectTimelineEstimatorView.vue';
import QRCodeGeneratorView from '../views/QRCodeGeneratorView.vue';
// Knowledge pages
import { 
  RgbVsCmykView,
  DeltaEView,
  BleedView,
  GrammageThicknessView,
  MaterialsOverviewView,
  FSCView
} from '../views/knowledge';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/tools/unit-converter',
    name: 'UnitConverter',
    component: UnitConverterView,
  },
  {
    path: '/tools/volume-weight-calculator',
    name: 'VolumeWeightCalculator',
    component: VolumeWeightCalculatorView,
  },
  {
    path: '/tools/simple-layout-calculator',
    name: 'SimpleLayoutCalculator',
    component: SimpleLayoutCalculatorView,
  },
  {
    path: '/tools/color-mode-converter',
    name: 'ColorModeConverter',
    component: ColorModeConverterView,
  },
  {
    path: '/tools/color-difference',
    name: 'ColorDifference',
    component: ColorDifferenceView,
  },
  {
    path: '/tools/packaging-icons',
    name: 'PackagingIcons',
    component: PackagingIconsView,
  },
  {
    path: '/tools/paper-weight-thickness-converter',
    name: 'PaperWeightThicknessConverter',
    component: PaperWeightThicknessConverterView,
  },
  {
    path: '/tools/packaging-material-database',
    name: 'PackagingMaterialDatabase',
    component: PackagingMaterialDatabaseView,
  },
  {
    path: '/tools/prepress-checklist',
    name: 'PrepressChecklist',
    component: PrepressChecklistView,
  },
  {
    path: '/tools/project-timeline-estimator',
    name: 'ProjectTimelineEstimator',
    component: ProjectTimelineEstimatorView,
  },
  {
    path: '/tools/qr-code-generator',
    name: 'QRCodeGenerator',
    component: QRCodeGeneratorView,
  },
  // Knowledge routes
  {
    path: '/knowledge/rgb-vs-cmyk',
    name: 'KnowledgeRgbVsCmyk',
    component: RgbVsCmykView,
  },
  {
    path: '/knowledge/delta-e',
    name: 'KnowledgeDeltaE',
    component: DeltaEView,
  },
  {
    path: '/knowledge/bleed',
    name: 'KnowledgeBleed',
    component: BleedView,
  },
  {
    path: '/knowledge/grammage-thickness',
    name: 'KnowledgeGrammageThickness',
    component: GrammageThicknessView,
  },
  {
    path: '/knowledge/materials-overview',
    name: 'KnowledgeMaterialsOverview',
    component: MaterialsOverviewView,
  },
  {
    path: '/knowledge/fsc',
    name: 'KnowledgeFSC',
    component: FSCView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
