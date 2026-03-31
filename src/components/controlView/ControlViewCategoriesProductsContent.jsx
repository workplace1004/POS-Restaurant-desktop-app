import React from 'react';
import { ControlViewPriceGroups } from './ControlViewPriceGroups.jsx';
import { ControlViewCategories } from './ControlViewCategories.jsx';
import { ControlViewProducts } from './ControlViewProducts.jsx';
import { ControlViewSubproducts } from './ControlViewSubproducts.jsx';
import { ControlViewKitchen } from './ControlViewKitchen.jsx';
import { ControlViewDiscounts } from './ControlViewDiscounts.jsx';

/** Top nav "Categories and products" — routes to Price Groups, Categories, Products, Subproducts, Kitchen, Discounts. */
export function ControlViewCategoriesProductsContent(p) {
  const { subNavId, tr } = p;
  if (subNavId === 'Price Groups') {
    return (
      <ControlViewPriceGroups
        tr={tr}
        priceGroupsLoading={p.priceGroupsLoading}
        priceGroups={p.priceGroups}
        priceGroupsListRef={p.priceGroupsListRef}
        updatePriceGroupsScrollState={p.updatePriceGroupsScrollState}
        openPriceGroupModal={p.openPriceGroupModal}
        openEditPriceGroupModal={p.openEditPriceGroupModal}
        setDeleteConfirmId={p.setDeleteConfirmId}
        canPriceGroupsScrollUp={p.canPriceGroupsScrollUp}
        canPriceGroupsScrollDown={p.canPriceGroupsScrollDown}
        scrollPriceGroupsByPage={p.scrollPriceGroupsByPage}
      />
    );
  }
  if (subNavId === 'Categories') {
    return (
      <ControlViewCategories
        tr={tr}
        categories={p.categories}
        categoriesLoading={p.categoriesLoading}
        categoriesListRef={p.categoriesListRef}
        updateCategoriesScrollState={p.updateCategoriesScrollState}
        openCategoryModal={p.openCategoryModal}
        openEditCategoryModal={p.openEditCategoryModal}
        setDeleteConfirmCategoryId={p.setDeleteConfirmCategoryId}
        handleMoveCategory={p.handleMoveCategory}
        canCategoriesScrollUp={p.canCategoriesScrollUp}
        canCategoriesScrollDown={p.canCategoriesScrollDown}
        scrollCategoriesByPage={p.scrollCategoriesByPage}
      />
    );
  }
  if (subNavId === 'Products') {
    return (
      <ControlViewProducts
        tr={tr}
        categories={p.categories}
        selectedCategoryId={p.selectedCategoryId}
        setSelectedCategoryId={p.setSelectedCategoryId}
        setSelectedProductId={p.setSelectedProductId}
        selectedProductId={p.selectedProductId}
        productsLoading={p.productsLoading}
        filteredProducts={p.filteredProducts}
        productHasSubproductsById={p.productHasSubproductsById}
        openProductModal={p.openProductModal}
        openProductPositioningModal={p.openProductPositioningModal}
        productSearch={p.productSearch}
        setProductSearch={p.setProductSearch}
        setShowProductSearchKeyboard={p.setShowProductSearchKeyboard}
        productsCategoryTabsRef={p.productsCategoryTabsRef}
        productsListRef={p.productsListRef}
        updateProductsScrollState={p.updateProductsScrollState}
        openProductSubproductsModal={p.openProductSubproductsModal}
        openEditProductModal={p.openEditProductModal}
        setDeleteConfirmProductId={p.setDeleteConfirmProductId}
        canProductsScrollUp={p.canProductsScrollUp}
        canProductsScrollDown={p.canProductsScrollDown}
        scrollProductsByPage={p.scrollProductsByPage}
      />
    );
  }
  if (subNavId === 'Subproducts') {
    return (
      <ControlViewSubproducts
        tr={tr}
        subproductsLoading={p.subproductsLoading}
        subproductGroupsLoading={p.subproductGroupsLoading}
        openSubproductModal={p.openSubproductModal}
        setShowManageGroupsModal={p.setShowManageGroupsModal}
        subproductGroups={p.subproductGroups}
        selectedSubproductGroupId={p.selectedSubproductGroupId}
        setSelectedSubproductGroupId={p.setSelectedSubproductGroupId}
        setSelectedSubproductId={p.setSelectedSubproductId}
        selectedSubproductId={p.selectedSubproductId}
        subproductsGroupTabsRef={p.subproductsGroupTabsRef}
        subproductsListRef={p.subproductsListRef}
        updateSubproductsScrollState={p.updateSubproductsScrollState}
        subproducts={p.subproducts}
        openEditSubproductModal={p.openEditSubproductModal}
        setDeleteConfirmSubproductId={p.setDeleteConfirmSubproductId}
        canSubproductsScrollUp={p.canSubproductsScrollUp}
        canSubproductsScrollDown={p.canSubproductsScrollDown}
        scrollSubproductsByPage={p.scrollSubproductsByPage}
      />
    );
  }
  if (subNavId === 'Kitchen') {
    return (
      <ControlViewKitchen
        tr={tr}
        kitchens={p.kitchens}
        openNewKitchenModal={p.openNewKitchenModal}
        kitchenListRef={p.kitchenListRef}
        updateKitchenScrollState={p.updateKitchenScrollState}
        openKitchenProductsModal={p.openKitchenProductsModal}
        openEditKitchenModal={p.openEditKitchenModal}
        setDeleteConfirmKitchenId={p.setDeleteConfirmKitchenId}
        canKitchenScrollUp={p.canKitchenScrollUp}
        canKitchenScrollDown={p.canKitchenScrollDown}
        scrollKitchenByPage={p.scrollKitchenByPage}
      />
    );
  }
  if (subNavId === 'Discounts') {
    return (
      <ControlViewDiscounts
        tr={tr}
        discounts={p.discounts}
        openNewDiscountModal={p.openNewDiscountModal}
        discountsListRef={p.discountsListRef}
        updateDiscountsScrollState={p.updateDiscountsScrollState}
        openEditDiscountModal={p.openEditDiscountModal}
        setDeleteConfirmDiscountId={p.setDeleteConfirmDiscountId}
        canDiscountsScrollUp={p.canDiscountsScrollUp}
        canDiscountsScrollDown={p.canDiscountsScrollDown}
        scrollDiscountsByPage={p.scrollDiscountsByPage}
      />
    );
  }
  return (
    <div className="rounded-xl border border-pos-border bg-pos-panel/30 p-8 min-h-[300px] flex items-center justify-center">
      <p className="text-pos-muted text-xl">Select a section above to manage {subNavId.toLowerCase()}.</p>
    </div>
  );
}
