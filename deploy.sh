# recreate the output folder
rm -rf ./dist
mkdir ./dist

# package the lambda function into zip files
pnpm --dir ./src/lambdas build
zip ./dist/woolworths_price_fetcher.zip ./src/lambdas/dist/woolworths_price_fetcher.js --junk-paths --quiet

# apply infrastructure changes
terraform -chdir=infra init
terraform -chdir=infra apply -auto-approve
