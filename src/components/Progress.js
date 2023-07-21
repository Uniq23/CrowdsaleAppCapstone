import ProgressBar from 'react-bootstrap/ProgressBar';

const Progress = ({ maxTokens, tokensSold, label }) => {
    return (
        <div className='my-3'>
            <ProgressBar now={((tokensSold / maxTokens) * 100)} label={`${(tokensSold / maxTokens) * 100}%`} />
            <p className='text-center my-3'>{tokensSold} / {maxTokens} { label }</p>
        </div>
    );
}

export default Progress;
