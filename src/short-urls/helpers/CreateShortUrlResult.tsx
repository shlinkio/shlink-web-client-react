import { faCopy as copyIcon } from '@fortawesome/free-regular-svg-icons';
import { faTimes as closeIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isNil } from 'ramda';
import { useEffect } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Tooltip } from 'reactstrap';
import { ShortUrlCreation } from '../reducers/shortUrlCreation';
import { StateFlagTimeout } from '../../utils/helpers/hooks';
import './CreateShortUrlResult.scss';
import { Result } from '../../utils/Result';

export interface CreateShortUrlResultProps extends ShortUrlCreation {
  resetCreateShortUrl: () => void;
  canBeClosed?: boolean;
}

const CreateShortUrlResult = (useStateFlagTimeout: StateFlagTimeout) => (
  { error, result, resetCreateShortUrl, canBeClosed = false }: CreateShortUrlResultProps,
) => {
  const [ showCopyTooltip, setShowCopyTooltip ] = useStateFlagTimeout();

  useEffect(() => {
    resetCreateShortUrl();
  }, []);

  if (error) {
    return (
      <Result type="error" className="mt-3">
        {canBeClosed && <FontAwesomeIcon icon={closeIcon} className="float-right pointer" onClick={resetCreateShortUrl} />}
        An error occurred while creating the URL :(
      </Result>
    );
  }

  if (isNil(result)) {
    return null;
  }

  const { shortUrl } = result;

  return (
    <Result type="success" className="mt-3">
      {canBeClosed && <FontAwesomeIcon icon={closeIcon} className="float-right pointer" onClick={resetCreateShortUrl} />}
      <b>Great!</b> The short URL is <b>{shortUrl}</b>

      <CopyToClipboard text={shortUrl} onCopy={setShowCopyTooltip}>
        <button
          className="btn btn-light btn-sm create-short-url-result__copy-btn"
          id="copyBtn"
          type="button"
        >
          <FontAwesomeIcon icon={copyIcon} /> Copy
        </button>
      </CopyToClipboard>

      <Tooltip placement="left" isOpen={showCopyTooltip} target="copyBtn">
        Copied!
      </Tooltip>
    </Result>
  );
};

export default CreateShortUrlResult;
