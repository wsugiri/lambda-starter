# Set variables
TIMESTAMP=$(date +"%Y%m%d-%H%M")

LAMBDA_ZIP="function.zip"
LAMBDA_NAME="${APP_NAME}-dev"
LAMBDA_KEY="deploy/lambdas/${LAMBDA_NAME}/${TIMESTAMP}/${LAMBDA_ZIP}"
LAMBDA_PATH="s3://${BUCKET_NAME}/${LAMBDA_KEY}"

LAYER_ZIP="layer.zip"
LAYER_NAME="${LAMBDA_NAME}-layer"
LAYER_KEY="deploy/layers/${LAYER_NAME}/${TIMESTAMP}/${LAYER_ZIP}"
LAYER_PATH="s3://${BUCKET_NAME}/${LAYER_KEY}"
LAYER_PKGS="s3://${BUCKET_NAME}/deploy/layers/${LAYER_NAME}/package.json"

STATIC_KEY="static/${LAMBDA_NAME}"
STATIC_PATH="s3://${BUCKET_NAME}/static/${LAMBDA_NAME}"

# Detect OS
os=$(uname -s)

# Skip installation if running on Windows (Cygwin/Mingw)
if [[ "$os" == CYGWIN* || "$os" == MINGW* ]]; then
  echo "Running on Windows. Skipping package installation..."
else
    # Install necessary packages if not already installed
    command -v zip >/dev/null 2>&1 || { echo >&2 "zip is required but not installed. Installing..."; apt-get update && apt-get install -y zip; }
    command -v jq >/dev/null 2>&1 || { echo >&2 "jq is required but not installed. Installing..."; apt-get update && apt-get install -y jq; }

    # Install awscli if not already installed
    if ! command -v aws &> /dev/null; then
        curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
        unzip -q awscliv2.zip
        ./aws/install > install.log
        rm -rf awscliv2.zip
    fi  
fi

# copy config
aws s3 cp "s3://${BUCKET_NAME}/config/${APP_NAME}/${ENV_STAGE}.env" ".env"
aws s3 cp "s3://${BUCKET_NAME}/config/${APP_NAME}/${ENV_STAGE}.client.env" "./client/.env"

# install & build client
echo "install & build client"
cd client || exit
npm install && npm run build && cd ..

# copy static
echo "copy static to s3"
aws s3 cp ./public $STATIC_PATH --recursive --acl public-read

# Install library
echo "install prod"
npm i --only=production

# # upload zip lambda to s3
echo "prepare upload zip lambda"
cp ./public/${STATIC_INDEX} ./src/views
zip -r $LAMBDA_ZIP src lambda.js .env
aws s3 cp $LAMBDA_ZIP $LAMBDA_PATH
echo "Function code uploaded to ${LAMBDA_PATH}"

# check and compare package.json
aws s3 cp $LAYER_PKGS remote-package.json --quiet || touch remote-package.json
local_dependencies=$(jq '.dependencies' < package.json)
remote_dependencies=$(jq '.dependencies' < remote-package.json)

LAYER_VERSION_ARN=$(aws lambda list-layer-versions --layer-name $LAYER_NAME --query 'LayerVersions[0].LayerVersionArn' --region $AWS_REGION --output text)

if [[ "$local_dependencies" == "$remote_dependencies" && "$LAYER_VERSION_ARN" != "None" ]]; then
    echo "Dependencies in package.json files are identical."
else
    echo "Dependencies in package.json files are different."

    # upload zip layer to s3
    echo "prepare zip layer"
    mkdir -p layer/nodejs && cp -r node_modules layer/nodejs
    cd layer && zip -r ../$LAYER_ZIP . --quiet && cd ..
    
    echo "prepare upload zip layer"
    aws s3 cp $LAYER_ZIP $LAYER_PATH
    aws s3 cp package.json $LAYER_PKGS

    # Publish a new version of the Lambda layer
    LAYER_VERSION_ARN=$(aws lambda publish-layer-version --layer-name $LAYER_NAME --content S3Bucket=$BUCKET_NAME,S3Key=$LAYER_KEY --query 'LayerVersionArn' --output text)
    if [[ -z "$LAYER_VERSION_ARN" ]]; then
        LAYER_VERSION_ARN=1
    fi
fi

echo "LAYER ARN: ${LAYER_VERSION_ARN}"

# Get the role ARN for the Lambda function
ROLE_ARN=$(aws iam get-role --role-name $ROLE_NAME --query 'Role.Arn' --output text)
echo "ROLE ARN: ${ROLE_ARN}"

# Create or update the Lambda function
if ! aws lambda get-function --function-name $LAMBDA_NAME > /dev/null 2>&1; then
    echo "Function $LAMBDA_NAME not found. Creating..."
    aws lambda create-function \
        --function-name $LAMBDA_NAME \
        --runtime $RUNTIME \
        --role $ROLE_ARN \
        --handler lambda.api \
        --code S3Bucket=$BUCKET_NAME,S3Key=$LAMBDA_KEY \
        --description "-" \
        --timeout 10 \
        --memory-size 256 \
        --region $AWS_REGION \
        --layers $LAYER_VERSION_ARN
else 
    echo "Updating Lambda function..."
    aws lambda update-function-code --function-name $LAMBDA_NAME --s3-bucket $BUCKET_NAME --s3-key $LAMBDA_KEY
    aws lambda update-function-configuration --function-name $LAMBDA_NAME --layers $LAYER_VERSION_ARN
fi

# Publish a new version of the Lambda function
echo "Publishing Lambda function version..."
aws lambda publish-version --function-name ${LAMBDA_NAME} --description "deploy on ${TIMESTAMP}"

# Clean up files and directories if they exist
echo 'Cleaning up - files'

# Safely remove files if it exists
[ -f "$LAMBDA_ZIP" ] && rm "$LAMBDA_ZIP"
[ -f "$LAYER_ZIP" ] && rm "$LAYER_ZIP"
[ -f "remote-package.json" ] && rm "remote-package.json"

# Safely remove directory if it exists
[ -d "layer" ] && rm -r "layer"

echo 'finish the process'