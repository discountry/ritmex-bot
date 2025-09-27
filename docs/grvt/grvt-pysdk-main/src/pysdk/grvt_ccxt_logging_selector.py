import logging
import os
import sys
from datetime import datetime

LOG_FILE = os.getenv("LOG_FILE", "FALSE").upper()
GRVT_ENV = os.getenv("GRVT_ENV")

if LOG_FILE == "TRUE":
    LOG_TIMESTAMP = datetime.now().strftime("%Y_%m_%d_%H_%M_%S")
    fn = sys.argv[0].split("/")[-1]
    fn_base = fn.split(".")[0]
    if GRVT_ENV:
        filename = f"logs/{fn_base}_{GRVT_ENV}_{LOG_TIMESTAMP}.log"
    else:
        filename = f"logs/{fn_base}_{LOG_TIMESTAMP}.log"
    os.makedirs("logs", exist_ok=True)
    logging.basicConfig(
        filename=filename,
        level=os.getenv("LOGGING_LEVEL", "INFO"),
        format="%(asctime)s.%(msecs)03d | %(levelname)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
    logger = logging.getLogger(__name__)
    logger.info(f"Using FILE logger {LOG_FILE=}")
else:
    logging.basicConfig(
        level=os.getenv("LOGGING_LEVEL", "INFO"),
        format="%(asctime)s - %(levelname)s - %(message)s",
    )
    logger = logging.getLogger(__name__)
    logger.info(f"Using CONSOLE logger {LOG_FILE=}")
