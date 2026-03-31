import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const controlPath = path.join(root, 'src/components/ControlView.jsx');
const extPropsPath = path.join(root, 'src/components/controlView/_extProps.txt');

const lines = fs.readFileSync(controlPath, 'utf8').split(/\r?\n/);
const extProps = fs
  .readFileSync(extPropsPath, 'utf8')
  .split('\n')
  .filter(Boolean)
  .map((line) => '              ' + line)
  .join('\n');

const replacement = `          ) : topNavId === 'cash-register' ? (
            <ControlViewCashRegisterSettingsContent
              tr={tr}
              subNavId={subNavId}
              templateTheme={templateTheme}
              setTemplateTheme={setTemplateTheme}
              savingTemplateSettings={savingTemplateSettings}
              setSavingTemplateSettings={setSavingTemplateSettings}
              paymentTypesLoading={paymentTypesLoading}
              openNewPaymentTypeModal={openNewPaymentTypeModal}
              paymentTypes={paymentTypes}
              paymentTypesListRef={paymentTypesListRef}
              updatePaymentTypesScrollState={updatePaymentTypesScrollState}
              canPaymentTypesScrollUp={canPaymentTypesScrollUp}
              canPaymentTypesScrollDown={canPaymentTypesScrollDown}
              scrollPaymentTypesByPage={scrollPaymentTypesByPage}
              togglePaymentTypeActive={togglePaymentTypeActive}
              openEditPaymentTypeModal={openEditPaymentTypeModal}
              onRequestDeletePaymentType={setDeleteConfirmPaymentTypeId}
              movePaymentType={movePaymentType}
            />
          ) : topNavId === 'categories-products' ? (
            <ControlViewCategoriesProductsContent
              subNavId={subNavId}
              tr={tr}
              priceGroupsLoading={priceGroupsLoading}
              priceGroups={priceGroups}
              priceGroupsListRef={priceGroupsListRef}
              updatePriceGroupsScrollState={updatePriceGroupsScrollState}
              openPriceGroupModal={openPriceGroupModal}
              openEditPriceGroupModal={openEditPriceGroupModal}
              setDeleteConfirmId={setDeleteConfirmId}
              canPriceGroupsScrollUp={canPriceGroupsScrollUp}
              canPriceGroupsScrollDown={canPriceGroupsScrollDown}
              scrollPriceGroupsByPage={scrollPriceGroupsByPage}
              categories={categories}
              categoriesLoading={categoriesLoading}
              categoriesListRef={categoriesListRef}
              updateCategoriesScrollState={updateCategoriesScrollState}
              openCategoryModal={openCategoryModal}
              openEditCategoryModal={openEditCategoryModal}
              setDeleteConfirmCategoryId={setDeleteConfirmCategoryId}
              handleMoveCategory={handleMoveCategory}
              canCategoriesScrollUp={canCategoriesScrollUp}
              canCategoriesScrollDown={canCategoriesScrollDown}
              scrollCategoriesByPage={scrollCategoriesByPage}
              selectedCategoryId={selectedCategoryId}
              setSelectedCategoryId={setSelectedCategoryId}
              setSelectedProductId={setSelectedProductId}
              selectedProductId={selectedProductId}
              productsLoading={productsLoading}
              filteredProducts={filteredProducts}
              productHasSubproductsById={productHasSubproductsById}
              openProductModal={openProductModal}
              openProductPositioningModal={openProductPositioningModal}
              productSearch={productSearch}
              setProductSearch={setProductSearch}
              setShowProductSearchKeyboard={setShowProductSearchKeyboard}
              productsCategoryTabsRef={productsCategoryTabsRef}
              productsListRef={productsListRef}
              updateProductsScrollState={updateProductsScrollState}
              openProductSubproductsModal={openProductSubproductsModal}
              openEditProductModal={openEditProductModal}
              setDeleteConfirmProductId={setDeleteConfirmProductId}
              canProductsScrollUp={canProductsScrollUp}
              canProductsScrollDown={canProductsScrollDown}
              scrollProductsByPage={scrollProductsByPage}
              subproductsLoading={subproductsLoading}
              subproductGroupsLoading={subproductGroupsLoading}
              openSubproductModal={openSubproductModal}
              setShowManageGroupsModal={setShowManageGroupsModal}
              subproductGroups={subproductGroups}
              selectedSubproductGroupId={selectedSubproductGroupId}
              setSelectedSubproductGroupId={setSelectedSubproductGroupId}
              setSelectedSubproductId={setSelectedSubproductId}
              selectedSubproductId={selectedSubproductId}
              subproductsGroupTabsRef={subproductsGroupTabsRef}
              subproductsListRef={subproductsListRef}
              updateSubproductsScrollState={updateSubproductsScrollState}
              subproducts={subproducts}
              openEditSubproductModal={openEditSubproductModal}
              setDeleteConfirmSubproductId={setDeleteConfirmSubproductId}
              canSubproductsScrollUp={canSubproductsScrollUp}
              canSubproductsScrollDown={canSubproductsScrollDown}
              scrollSubproductsByPage={scrollSubproductsByPage}
              kitchens={kitchens}
              openNewKitchenModal={openNewKitchenModal}
              kitchenListRef={kitchenListRef}
              updateKitchenScrollState={updateKitchenScrollState}
              openKitchenProductsModal={openKitchenProductsModal}
              openEditKitchenModal={openEditKitchenModal}
              setDeleteConfirmKitchenId={setDeleteConfirmKitchenId}
              canKitchenScrollUp={canKitchenScrollUp}
              canKitchenScrollDown={canKitchenScrollDown}
              scrollKitchenByPage={scrollKitchenByPage}
              discounts={discounts}
              openNewDiscountModal={openNewDiscountModal}
              discountsListRef={discountsListRef}
              updateDiscountsScrollState={updateDiscountsScrollState}
              openEditDiscountModal={openEditDiscountModal}
              setDeleteConfirmDiscountId={setDeleteConfirmDiscountId}
              canDiscountsScrollUp={canDiscountsScrollUp}
              canDiscountsScrollDown={canDiscountsScrollDown}
              scrollDiscountsByPage={scrollDiscountsByPage}
            />
          ) : topNavId === 'external-devices' ? (
            <ControlViewExternalDevicesContent
${extProps}
            />
          ) : topNavId === 'tables' ? (
            <ControlViewTablesContent
              tr={tr}
              tableLocationsLoading={tableLocationsLoading}
              tableLocations={tableLocations}
              tableLocationsListRef={tableLocationsListRef}
              updateTableLocationsScrollState={updateTableLocationsScrollState}
              openTableLocationModal={openTableLocationModal}
              openSetTablesModal={openSetTablesModal}
              openEditTableLocationModal={openEditTableLocationModal}
              setDeleteConfirmTableLocationId={setDeleteConfirmTableLocationId}
              canTableLocationsScrollUp={canTableLocationsScrollUp}
              canTableLocationsScrollDown={canTableLocationsScrollDown}
              scrollTableLocationsByPage={scrollTableLocationsByPage}
            />
          ) : null}`;

const head = lines.slice(0, 5162).join('\n');
const tail = lines.slice(5909).join('\n');
const out = `${head}\n${replacement}\n${tail}`;
fs.writeFileSync(controlPath, out);
console.log('Spliced lines 5163-5909, new middle chars', replacement.length);
